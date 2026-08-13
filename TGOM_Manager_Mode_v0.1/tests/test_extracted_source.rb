#!/usr/bin/env ruby
# Source-inspection checks against extracted TGOM/Essentials data. This is not a
# live-save or rendered-game test.
require "zlib"

data = ARGV[0] || abort("usage: test_extracted_source.rb EXTRACTED_DATA_DIR")
scripts_path = File.join(data, "Scripts.rxdata")
system_path = File.join(data, "System.rxdata")
abort("missing extracted Scripts.rxdata/System.rxdata") unless File.file?(scripts_path) && File.file?(system_path)
trainers_path = File.join(data, "trainers.dat")
abort("missing extracted trainers.dat") unless File.file?(trainers_path)

scripts = Marshal.load(File.binread(scripts_path)).map { |entry| Zlib::Inflate.inflate(entry[2]) }.join("\n")
raise "pbChangeLevel no longer requires a scene refresh" unless scripts.include?("scene.pbRefresh")
raise "pbChangeLevel no longer updates move-learning UI" unless scripts.include?("pbLearnMove(pkmn, i[1], true) { scene.pbUpdate }")
raise "level-up evolution path missing" unless scripts.include?("check_evolution_on_level_up")
raise "encounter tier source changed" unless scripts.include?("$player.badge_count >= 5") && scripts.include?("$player.badge_count >= 3")
raise "battle-end hook signature changed" unless scripts.include?("EventHandlers.trigger(:on_end_battle, outcome, can_lose)")

# Map031/Event4 source contract: complete challenger sets for each active rank.
module RPG
  class Map; end; class Event; end; class Event::Page; end
  class Event::Page::Condition; end; class Event::Page::Graphic; end
  class EventCommand; end; class MoveRoute; end; class MoveCommand; end
  class AudioFile; end
end
class Tone; def self._load(_); allocate; end; end
class Color; def self._load(_); allocate; end; end
class Table; def self._load(_); allocate; end; end
map31 = Marshal.load(File.binread(File.join(data, "Map031.rxdata")))
event4 = map31.instance_variable_get(:@events)[4]
actual = event4.instance_variable_get(:@pages).first(2).map do |page|
  list = page.instance_variable_get(:@list)
  source = list.select { |command| [355, 655].include?(command.instance_variable_get(:@code)) }.map { |command| command.instance_variable_get(:@parameters)[0].to_s }
  source.concat(list.select { |command| command.instance_variable_get(:@code) == 111 && command.instance_variable_get(:@parameters)[0] == 12 }.map { |command| command.instance_variable_get(:@parameters)[1].to_s })
  source = source.join("\n")
  source.scan(/TrainerBattle\.start\(:(\w+),["']([^"']+)["'](?:,(\d+))?\)/).map { |type, name, version| [type.to_sym, name, (version || 0).to_i] }
end
manager_source = File.read(File.expand_path('../TGOM_Manager_Mode.rb', __dir__))
bracket_source = manager_source[/GYM_BRACKETS\s*=\s*(\{.*?\n  \})\.freeze/m, 1]
brackets = eval(bracket_source)
raise "Rank0 challenger set incomplete" unless actual[0] == brackets[0]
raise "Rank1 challenger set incomplete" unless actual[1] == brackets[1]
module GameData; class Trainer; end; end
trainers = Marshal.load(File.binread(trainers_path))
averages = brackets.values_at(0, 1).map do |bracket|
  levels = bracket.flat_map { |identity| trainers.fetch(identity).instance_variable_get(:@pokemon).map { |pokemon| pokemon[:level] } }
  [levels.sum / levels.length, levels.sum.to_f / levels.length]
end
raise "Rank0 target drift: #{averages[0].inspect}" unless averages[0][0] == 9
raise "Rank1 target drift: #{averages[1].inspect}" unless averages[1][0] == 20

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
