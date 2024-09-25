import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { enableScreens } from "react-native-screens"; // Importação necessária

import TaskScreen from "./screens/TaskScreen";
import { Text, View } from "react-native";

// Habilita otimização de telas
enableScreens(); // Coloque logo após as importações

const Tab = createMaterialTopTabNavigator();

function MessagesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Messages</Text>
    </View>
  );
}

function LastActivityScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Last Activity</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "white" }, // Cor do fundo
          tabBarIndicatorStyle: {
            backgroundColor: "black", // Cor do traço indicador da aba ativa
            height: 3, // Espessura do traço
          },
        }}
      >
        <Tab.Screen name="Today's Task" component={TaskScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />

        <Tab.Screen name="Last Activity" component={LastActivityScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
