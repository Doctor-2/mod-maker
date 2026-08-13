TGOM Manager Mode v0.1（保守核心）

构建（仓库维护者）：
在仓库根目录运行：
  TGOM_Manager_Mode_v0.1/tools/build_package.sh
生成文件位于 dist/TGOM_Manager_Mode_v0.1.zip，不加入 Git。
脚本使用 main 中保持不变的 PluginScripts.before_companion.rxdata，注入 TGOM_Manager_Mode.rb，并将原文件作为恢复备份一起打包。

安装：
1. 先在游戏中保存，然后关闭游戏。
2. 备份游戏 Data/PluginScripts.rxdata。
3. 解压 dist/TGOM_Manager_Mode_v0.1.zip，用包内 Data/PluginScripts.rxdata 替换游戏中的同名文件。
4. 启动已有存档。不会传送、清谜题或修改地图/存档文件。

恢复：
关闭游戏，把包内 Data/PluginScripts.pre-manager.rxdata 复制回游戏 Data 目录并改名为 PluginScripts.rxdata。

本版只启用可证明安全的功能：关闭步行随机遭遇；保留脚本遭遇；惰性 namespaced 状态及经过调用方审计的 token/scouting helper。
因为上传的活动 PluginScripts 与 before_companion 完全相同，且其中没有 Companion Logger 插件，本包不会伪造或覆盖 logger。区域清理、菜单、训练、快速旅行、Gym shift/战败 token 均保持关闭（fail closed），避免破坏剧情奖励。
