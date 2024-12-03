import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';
import * as Updates from 'expo-updates';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [debugTextList, seDebugTextList] = useState<string[]>('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function onFetchUpdateAsync() {
    try {
      if (__DEV__) {
        console.log(
          "INFO: onFetchUpdateAsync won't fetch updates for dev build",
        );
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      const newDebugTextList = [
        ...debugTextList,
        JSON.stringify({response: update}, null, ' '),
      ];
      seDebugTextList(newDebugTextList);

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      const newDebugTextList = [
        ...debugTextList,
        JSON.stringify({error}, null, ' '),
      ];
      seDebugTextList(newDebugTextList);

      Alert.alert('Update fetch failed', 'Maybe no luck? ', [
        {
          text: `Error fetching latest Expo update: ${JSON.stringify(error)}`,
          onPress: () => console.log('I gave up'),
        },
      ]);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="What is it?">
            <Text>EAS update POC</Text>
          </Section>
          <Section title="This text should change after an update:">
            <Text>This is 6th expo update</Text>
          </Section>
          {debugTextList.length > 0 && (
            <Section title="DEBUG ZONE ☢">
              <>
                {debugTextList.map(debugText => (
                  <Text>{debugText}</Text>
                ))}
              </>
            </Section>
          )}
          <Button title="Fetch update" onPress={onFetchUpdateAsync} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
