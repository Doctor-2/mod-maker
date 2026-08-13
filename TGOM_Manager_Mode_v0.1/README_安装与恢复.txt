TGOM Manager Mode v0.1

构建：在仓库根目录运行 TGOM_Manager_Mode_v0.1/tools/build_package.sh。
构建脚本只使用根目录当前有效的 PluginScripts.rxdata（包含 Companion Logger），
并拒绝 PluginScripts.before_companion.rxdata。生成的 .rxdata/.zip 位于 dist，不提交 Git。

安装：关闭游戏并备份 Data/PluginScripts.rxdata，然后用 dist 包内同名文件替换。
恢复：关闭游戏，将包内 PluginScripts.pre-manager.rxdata 改名并复制回 Data。

Pokégear 中的 Gym Staff 提供：安全清理已审计的普通训练家、三选一招募、追赶训练、
设置 Gym 锚点、前往 Gym、已解锁安全入口和返回。Token 只来自完成 Gym shift、Rank Up、正式区域解锁以及每个重要剧情战
首次失败；不会按 Reputation 数值发放。报告生成时消耗一个 Token，报告会保存到解决，
可招募一只或全部拒绝，并可永久屏蔽一只被拒绝候选。候选只取当前已解锁区域的真实
遭遇表 Fire 属性宝可梦并保留稀有度权重。

清理覆盖 audit/ROUTINE_ALLOWLIST.md 列出的 Maps 3/7/8/10/21 区域普通训练家，
可在 Gym 中从已解锁区域列表选择，无需亲自站在该地图。
逐页检查原 RPG 页面条件，精确给予训练家奖金、Reputation、Highest Reputation 与
奖金统计，并设置原页面自开关。Training 使用当前 Rank 的 Gym challenger 等级组。
招募保留真实已解锁遭遇槽位的等级，不直接生成 Gym 目标等级；之后可用 Training 正常升级。

所有 Gym/剧情/Boss/奖励战保持原样。Map004–006 被整体保护，以保留 Cave of
Knowledge 谜题、Ken、Lillith 和 Charmander/御三家奖励链。Manager 日志写入现有
Companion Logger，不替换或禁用它。
