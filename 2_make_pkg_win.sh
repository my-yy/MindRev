#这个脚本在windows下执行
#务必删除里面的内容，以防上传错误
rm -rf ./dist_electron/*
npm run build_mac
explorer dist_electron
