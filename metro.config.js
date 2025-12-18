const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Handle web-specific aliasing for react-native-maps
// Since we don't have platform available here easily for a simple object, 
// we can use the resolver to handle it.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'react-native-maps') {
        return {
            filePath: path.resolve(projectRoot, 'src/mocks/react-native-maps.web.js'),
            type: 'sourceFile',
        };
    }

    // If we have an original, use it. But usually in Expo it's undefined by default.
    if (originalResolveRequest && originalResolveRequest !== config.resolver.resolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }

    // Standard resolution fallback
    return context.resolveRequest(context, moduleName, platform);
};

// Wait, I am STILL risking recursion if context.resolveRequest is the same function.
// In Metro 0.66+, the way to fallback is to call the internal resolve function.
const { resolve } = require('metro-resolver');

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'react-native-maps') {
        return {
            filePath: path.resolve(projectRoot, 'src/mocks/react-native-maps.web.js'),
            type: 'sourceFile',
        };
    }

    // Use the standard metro-resolver for everything else
    try {
        return resolve(context, moduleName, platform);
    } catch (e) {
        // If metro-resolver is not available or fails, fallback to context's own resolver if it's different
        if (context.resolveRequest && context.resolveRequest !== config.resolver.resolveRequest) {
            return context.resolveRequest(context, moduleName, platform);
        }
        throw e;
    }
};

module.exports = config;
