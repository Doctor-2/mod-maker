TGOM Manager Mode v0.1

构建：在仓库根目录运行 TGOM_Manager_Mode_v0.1/tools/build_package.sh。
构建脚本只使用根目录当前有效的 PluginScripts.rxdata（包含 Companion Logger），
并拒绝 PluginScripts.before_companion.rxdata。生成的 .rxdata/.zip 位于 dist，不提交 Git。

安装：关闭游戏并备份 Data/PluginScripts.rxdata，然后用 dist 包内同名文件替换。
恢复：关闭游戏，将包内 PluginScripts.pre-manager.rxdata 改名并复制回 Data。

暂停菜单中的 Gym Staff 提供：安全清理已审计的普通训练家、三选一招募、追赶训练、
设置 Gym 锚点、前往 Gym 和返回。Scout Token 来自 Reputation 每 100 点里程碑；
来源永久去重。招募会过滤黑名单和最近候选。清理只覆盖 audit/ROUTINE_ALLOWLIST.md
列出的 Map003 事件，精确给予训练家奖金与事件 Reputation，并设置原页面自开关。

所有 Gym/剧情/Boss/奖励战保持原样。Map004–006 被整体保护，以保留 Cave of
Knowledge 谜题、Ken、Lillith 和 Charmander/御三家奖励链。Manager 日志写入现有
Companion Logger，不替换或禁用它。
