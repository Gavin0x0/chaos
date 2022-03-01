#!/usr/bin/env sh
# Mac 上用这个
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn run build

# 进入生成的文件夹
cd build
# 如果是发布到自定义域名
# echo www.mojimoji.top > CNAME

echo "🔔  添加统计代码「暂无」"
sed -i '' '/<html/a\
<script>//todo</script>' index.html
echo "✅  添加 执行完毕"

git init

git add -A

git commit -m 'deploy'

git push -f git@47.98.222.103:/home/gitrepo/chaos.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:<USERNAME>/vuepress.git master:gh-pages

cd -
