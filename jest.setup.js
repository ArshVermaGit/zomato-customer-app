import 'react-native-gesture-handler/jestSetup';
import { server } from '@zomato/test-utils';

// Start MSW Server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
    const View = require('react-native').View;
    return {
        default: {
            call: () => { },
            createAnimatedComponent: (c) => c,
            View: View,
            Image: 'Image',
            ScrollView: 'ScrollView',
            Text: 'Text',
        },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
        useAnimatedProps: jest.fn(() => ({})),
        withTiming: (val) => val,
        withSpring: (val) => val,
        withDelay: (_, val) => val,
        withSequence: (...args) => args[args.length - 1],
        FadeInDown: {
            delay: () => ({ springify: () => ({ damping: () => ({}) }) })
        },
        Easing: {
            bezier: () => { },
            out: () => { },
            ease: () => { },
        },
        Extrapolation: {
            CLAMP: 'clamp',
        },
        interpolate: () => 0,
        runOnJS: (fn) => fn,
    };
});

// Mock Reanimated Layout Animations
// jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {},
    }),
}));

// Mock Safe Area Context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Fast Image
jest.mock('react-native-fast-image', () => {
    const MockFastImage = ({ source, style, resizeMode, ...props }) => {
        // Render a basic Image or View as a mock
        const { Image } = require('react-native');
        return <Image source={source} style={style} {...props} />;
    };
    MockFastImage.resizeMode = {
        contain: 'contain',
        cover: 'cover',
        stretch: 'stretch',
        center: 'center',
    };
    MockFastImage.priority = {
        low: 'low',
        normal: 'normal',
        high: 'high',
    };
    return MockFastImage;
});

// Mock Lucide Icons
jest.mock('lucide-react-native', () => {
    const React = require('react');
    const { View } = require('react-native');
    const Icon = (name) => (props) => React.createElement(View, { ...props, testID: name });
    return {
        Heart: Icon('Heart'),
        Clock: Icon('Clock'),
        Star: Icon('Star'),
        Ghost: Icon('Ghost'),
        WifiOff: Icon('WifiOff'),
        User: Icon('User'),
        Search: Icon('Search'),
        Home: Icon('Home'),
        ShoppingBag: Icon('ShoppingBag'),
    };
});
