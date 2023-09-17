#务必删除里面的内容，以防上传错误
rm -rf ./dist_electron/*
export PYTHON_PATH="/Users/my/.pyenv/versions/2.7.18/bin/python"
npm run build_mac
npm run build_win
open dist_electron
