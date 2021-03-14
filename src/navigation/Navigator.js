import React, {useEffect, useState, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import '@react-navigation/drawer';

import {AuthContext} from '../context/context';
import UserImages from '../screens/UserImages';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ViewImages from '../screens/ViewImages';

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const UserImagesStack = createStackNavigator();
const RootStack = createStackNavigator();

const RootStackScreen = ({user}) => (
  <RootStack.Navigator headerMode="none">
    {user?.accessToken ? (
      <RootStack.Screen
        name="App"
        component={AppScreen}
        options={{animationEnabled: false}}
        initialParams={{user}}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{animationEnabled: false}}
      />
    )}
  </RootStack.Navigator>
);

const AppScreen = ({route}) => (
  <Tabs.Navigator>
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      initialParams={{user: route.params.user}}
    />
    <Tabs.Screen
      name="Your images"
      component={UserImagesStackScreen}
      initialParams={{user: route.params.user}}
    />
  </Tabs.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Register" component={Register} />
  </AuthStack.Navigator>
);

const HomeStackScreen = ({route}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={Home}
      initialParams={{user: route.params.user}}
    />
    <HomeStack.Screen
      name="ViewImages"
      component={ViewImages}
      initialParams={{user: route.params.user}}
    />
  </HomeStack.Navigator>
);

const UserImagesStackScreen = ({route}) => (
  <UserImagesStack.Navigator>
    <UserImagesStack.Screen
      name="Your images"
      component={UserImages}
      initialParams={{user: route.params.user}}
    />
  </UserImagesStack.Navigator>
);

const Navigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const authContext = useMemo(() => {
    return {
      Login: (loginUser) => {
        setIsLoading(false);
        setUser(loginUser);
      },
      Register: () => {
        setIsLoading(false);
        setUser('asdf');
      },
      Logout: () => {
        setIsLoading(false);
        setUser(null);
      },
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen user={user} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Navigator;
