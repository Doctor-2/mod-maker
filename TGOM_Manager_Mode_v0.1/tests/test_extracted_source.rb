#!/usr/bin/env ruby
# Source-inspection checks against extracted TGOM/Essentials data. This is not a
# live-save or rendered-game test.
require "zlib"

data = ARGV[0] || abort("usage: test_extracted_source.rb EXTRACTED_DATA_DIR")
scripts_path = File.join(data, "Scripts.rxdata")
system_path = File.join(data, "System.rxdata")
abort("missing extracted Scripts.rxdata/System.rxdata") unless File.file?(scripts_path) && File.file?(system_path)

scripts = Marshal.load(File.binread(scripts_path)).map { |entry| Zlib::Inflate.inflate(entry[2]) }.join("\n")
raise "pbChangeLevel no longer requires a scene refresh" unless scripts.include?("scene.pbRefresh")
raise "pbChangeLevel no longer updates move-learning UI" unless scripts.include?("pbLearnMove(pkmn, i[1], true) { scene.pbUpdate }")
raise "level-up evolution path missing" unless scripts.include?("check_evolution_on_level_up")
raise "encounter tier source changed" unless scripts.include?("$player.badge_count >= 5") && scripts.include?("$player.badge_count >= 3")
raise "battle-end hook signature changed" unless scripts.include?("EventHandlers.trigger(:on_end_battle, outcome, can_lose)")

module RPG
  class System; class Words; end; class TestBattler; end; end
  class AudioFile; end
end
system = Marshal.load(File.binread(system_path))
switches = system.instance_variable_get(:@switches)
variables = system.instance_variable_get(:@variables)
raise "Rank 1 switch drift" unless switches[104] == "Rank 1"
raise "Fire Gym switch drift" unless switches[76] == "FireGym"
raise "GymDay switch drift" unless switches[101] == "GymDay"
raise "BattlesComplete variable drift" unless variables[66] == "BattlesComplete"
raise "Reputation variables drift" unless variables[29] == "Reputation" && variables[34] == "Highest Reputation"
puts "extracted source contracts passed (inspection only; not a live runtime)"
