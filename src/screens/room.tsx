import React, { FC } from "react";
import { Buttons } from "../components/buttons";
import { Text,  View  } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
// import { post } from "../utils/request";

const UPDATE_MS = 100;
// const DATA_QUE_SIZE = 30;
// const TEST_URL = "http://1c77-180-39-77-67.ngrok.io/mochiage/1";

interface MLRequest {
  digx: number,
  digy: number,
  digz: number
  accx: number,
  accy: number,
  accz: number,
}

const round = (n: number | null) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100);
};

export const RoomScreen: FC = (props: any) => {
  const [data, setData] = React.useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [lastThreeAxisMeasurement, setLastThreeAxisMeasurement] = React.useState<
    ThreeAxisMeasurement
  >({ x: 0, y: 0, z: 0 });
  const [dataQue, setDataQue] = React.useState<MLRequest[]>([]);
  const [subscription, setSubscription] = React.useState<any | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  // const [requestLock, setRequestLock] = React.useState(false);

  const _subscribe = () => {
    const listener = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });
    setSubscription(listener);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    return;
  };

  // 初期化
  React.useEffect(() => {
    (async () => {
        _subscribe();
      Accelerometer.setUpdateInterval(UPDATE_MS);
    })();
    return () => _unsubscribe();
  }, []);
  React.useEffect(() => {
    (async () => {
      // if (dataQue.length > DATA_QUE_SIZE && !requestLock) {
      //   setRequestLock(true);
      //   const response = await post(TEST_URL, dataQue);
      //   if (typeof response === "string") {
      //     setErrorMessage(response);
      //   } else {
      //     setErrorMessage("");
      //   }
      //   setDataQue([]);
      //   setRequestLock(false);
      // }
    })();
  }, [dataQue]);
  React.useEffect(() => {
    (async () => {
      const roundX = round(data.x);
      const roundY = round(data.y);
      const roundZ = round(data.z);
      const beforeRoundX = round(lastThreeAxisMeasurement.x);
      const beforeRoundY = round(lastThreeAxisMeasurement.y);
      const beforeRoundZ = round(lastThreeAxisMeasurement.z);
      const accRequest: MLRequest = {
        digx: roundX,
        digy: roundY,
        digz: roundZ,
        accx: (beforeRoundX - roundX) * UPDATE_MS,
        accy: (beforeRoundY - roundY) * UPDATE_MS,
        accz: (beforeRoundZ - roundZ) * UPDATE_MS
      };
      const newDataQue: MLRequest[] = JSON.parse(JSON.stringify(dataQue));
      newDataQue.push(accRequest);
      setDataQue(newDataQue);
      setLastThreeAxisMeasurement(data);
    })();
  }, [data]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Buttons.back {...props} title="Back to top"/>
      <Text>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      <Text>
        {errorMessage}
      </Text>
    </View>
  );
};