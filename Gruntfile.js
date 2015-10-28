/**
 * Created by Jack on 2015-10-19.
 */
//包装函数
module.exports=function(grunt){
    grunt.initConfig({
        //获取package.json中的信息
        pkg:grunt.file.readJSON('package.json'),
        pkgV1:grunt.file.readJSON('src/0.0.1/package.json'),
        pkgV2:grunt.file.readJSON('src/0.0.2/package.json'),
        //文件拷贝
        copy:{
            fonts:{
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['src/0.0.2/css/fonts/**'],
                dest: 'demos/css/fonts/'
            }
        },
        //文件合并
        concat:{
            filesV1:{
                src:['src/0.0.1/js/sinoUI.js','src/0.0.1/js/module/*.js','src/0.0.1/js/plugin/*.js'],
                dest:'release/0.0.1/js/SinoUI.Debug.js'
            },
            filesV2:{
                src:['src/<%= pkgV2.version %>/js/sinoUI.js','src/<%= pkgV2.version %>/js/module/*.js','src/<%= pkgV2.version %>/js/plugin/*.js','src/<%= pkgV2.version %>/js/sino_click.js','src/<%= pkgV2.version %>/js/sinoControl.js'],
                dest:'release/<%= pkgV2.version %>/js/SinoUI.Debug.js'
            },
            zepto:{
                src:['src/<%= pkgV2.version %>/js/zepto/zepto.js','src/<%= pkgV2.version %>/js/zepto/*.js'],
                dest:'release/<%= pkgV2.version %>/js/zepto.Debug.js'
            },
            cssFilesV2:{
                src:['src/<%= pkgV2.version %>/css/sinoUI.css','src/<%= pkgV2.version %>/css/*.css'],
                dest:'demos/css/sinoUI.Debug.css'
            }
        },
        //JS文件压缩
        uglify:{
            releaseV1:{
                options: {
                    stripBanners:true,
                    mangle: false, //不混淆变量名
                    preserveComments: false, //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    banner:'/* <%=pkgV1.name%>-V<%=pkgV1.version%> By <%=pkgV1.author%> <%=grunt.template.today("yyyy-mm-dd")%> */\n',
                    footer:'\n/* <%= pkgV1.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: [{
                    expand: true,
                    cwd: 'release/<%= pkgV1.version %>/js',
                    src: ['SinoUI.Debug.js'],
                    dest: 'release/<%= pkgV1.version %>/js',
                    ext:'.min.js'
                }]
            },
            releaseV2:{
                options: {
                    stripBanners:true,
                    mangle: true, //不混淆变量名
                    preserveComments: false, //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    banner:'/* <%=pkgV2.name%>-V<%=pkgV2.version%> By <%=pkgV2.author%> <%=grunt.template.today("yyyy-mm-dd")%> */\n',
                    footer:'\n/* <%= pkgV2.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: [{
                    expand: true,
                    cwd: 'release/<%= pkgV2.version %>/js',
                    src: ['SinoUI.Debug.js'],
                    dest: 'release/<%= pkgV2.version %>/js',
                    ext:'.min.js'
                }]
            }
        },
        //CSS文件压缩
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'demos/css/',//原文件目录
                    src: ['*.css', '!*.min.css'],
                    dest: 'demos/css',//压缩后文件目录
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/*/js/*.js','src/*/js/*/*.js','src/*/css/*.css','package.json'],
                tasks: ['concat:filesV2','concat:zepto','concat:cssFilesV2','uglify:releaseV2','cssmin','copy'],
                options: {
                    spawn: false
                }
            }
        }
    });
    //告诉grunt我们将要加载的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //告诉grunt当我们在终端中输入grunt时需要做哪些操作（注意先后顺序）
    grunt.registerTask('default',['concat:filesV2','concat:cssFilesV2','uglify:releaseV2','cssmin','copy','watch']);
};
