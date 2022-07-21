import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';

const pathResolve = (pathStr: string): string => {
    return resolve(__dirname, '.', pathStr);
};

/**
 * gzip 压缩
 */
const viteCompressionOptions = {
    filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
    threshold: 1024, // 文件容量大于这个值进行压缩
    //algorithm: 'gzip', // 压缩方式
    ext: 'gz', // 后缀名
    deleteOriginFile: false // 压缩后是否删除压缩源文件
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    let buildPlugins = [];
    if (command === 'build') {
        buildPlugins.push(viteCompression(viteCompressionOptions));
    }
    return {
        plugins: [
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: '火星的青青草原'
                    }
                }
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [pathResolve('src/svg/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]'
            }),
            ...buildPlugins
        ],
        resolve: {
            alias: {
                '@': pathResolve('src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false
                }
            }
        },
        server: {
            open: false,
            https: false,
            host: 'localhost',
            port: 5000, // 端口
            proxy: {
                '/api': {
                    target: 'http://test.rongcl.cn/',
                    changeOrigin: true,
                    ws: false,
                    rewrite: (path) => path.replace(/^\/api/, '/api')
                }
            },
            hmr: {
                overlay: true
            }
        },
        build: {
            outDir: 'dist',
            assetsDir: './static', //静态资源文件夹，和outDir同级
            assetsInlineLimit: 4096, // kb, 小于此值将内联base64格式
            cssCodeSplit: true,
            sourcemap: false,
            chunkSizeWarningLimit: 500,
            minify: 'terser',
            terserOptions: {
                compress: {
                    // eslint-disable-next-line camelcase
                    drop_console: true,
                    // eslint-disable-next-line camelcase
                    drop_debugger: true
                }
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        //静态资源分拆打包
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            }
        }
    };
});
