import React, {useEffect, useState, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; #JaiLeSeumTurboModuleError
// import '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '../context/context';
import UserImages from '../screens/UserImages';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ViewImages from '../screens/ViewImages';
import UploadImages from '../screens/UploadImages';
import UpdateImage from '../screens/UpdateImage';
import Favorites from '../screens/Favorites';
import {theme} from '../core/theme';

const Tabs = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const UserImagesStack = createStackNavigator();
const UploadImagesStack = createStackNavigator();
const FavoritesStack = createStackNavigator();

const RootStackScreen = ({user}) => (
  <RootStack.Navigator headerMode="none">
    {user?.accessToken ? (
      <RootStack.Screen
        name="App"
        component={AppScreen}
        initialParams={{user}}
      />
    ) : (
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
    )}
  </RootStack.Navigator>
);

const AppScreen = ({route}) => (
  <Tabs.Navigator initialRouteName="Home" activeColor="#fff" shifting={true}>
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      initialParams={{user: route.params.user}}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: theme.colors.primary,
        tabBarIcon: ({color}) => {
          return <Icon name="ios-home" color={color} size={26} />;
        },
      }}
    />
    <Tabs.Screen
      name="Your images"
      component={UserImagesStackScreen}
      initialParams={{user: route.params.user}}
      options={{
        tabBarLabel: 'Your images',
        tabBarColor: theme.colors.secondary,
        tabBarIcon: ({color}) => (
          <Icon name="ios-image" color={color} size={26} />
        ),
      }}
    />
    <Tabs.Screen
      name="Upload images"
      component={UploadImagesStackScreen}
      initialParams={{user: route.params.user}}
      options={{
        tabBarLabel: 'Upload images',
        tabBarColor: theme.colors.primary,
        tabBarIcon: ({color}) => (
          <Icon name="cloud-upload" color={color} size={26} />
        ),
      }}
    />
    <Tabs.Screen
      name="Favorites"
      component={FavoritesStackScreen}
      initialParams={{user: route.params.user}}
      options={{
        tabBarLabel: 'Favorites',
        tabBarColor: theme.colors.secondary,
        tabBarIcon: ({color}) => (
          <Icon name="ios-heart" color={color} size={26} />
        ),
      }}
    />
  </Tabs.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Register" component={Register} />
  </AuthStack.Navigator>
);

const HomeStackScreen = ({route}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
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

const UserImagesStackScreen = ({route}) => {
  return (
    <UserImagesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.secondary,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <UserImagesStack.Screen
        name="Your images"
        component={UserImages}
        initialParams={{user: route.params.user}}
      />
      <UserImagesStack.Screen
        name="Edit image"
        component={UpdateImage}
        initialParams={{user: route.params.user}}
      />
    </UserImagesStack.Navigator>
  );
};

const UploadImagesStackScreen = ({route}) => (
  <UploadImagesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <UploadImagesStack.Screen
      name="Upload images"
      component={UploadImages}
      initialParams={{user: route.params.user}}
    />
  </UploadImagesStack.Navigator>
);

const FavoritesStackScreen = ({route}) => (
  <FavoritesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.secondary,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <FavoritesStack.Screen
      name="Favorites"
      component={Favorites}
      initialParams={{user: route.params.user}}
    />
  </FavoritesStack.Navigator>
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
