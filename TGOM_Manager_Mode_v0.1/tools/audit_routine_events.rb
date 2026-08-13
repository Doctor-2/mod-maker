#!/usr/bin/env ruby
# Produces a deterministic, reviewable inventory of every event command. It
# deliberately proposes a routine only for the narrow trainer-page grammar.
require "json"
require "digest"

module RPG
  class Map; end
  class Event; end
  class Event::Page; end
  class Event::Page::Condition; end
  class Event::Page::Graphic; end
  class EventCommand; end
  class MoveRoute; end
  class MoveCommand; end
  class AudioFile; end
end
class Tone; def self._load(_data); allocate; end; end
class Color; def self._load(_data); allocate; end; end
class Table; def self._load(_data); allocate; end; end

root = ARGV[0] || abort("usage: audit_routine_events.rb EXTRACTED_DATA_DIR [OUTPUT.json]")
output = ARGV[1] || File.expand_path("../audit/full_event_audit.json", __dir__)
allowed_codes = [0, 101, 111, 112, 113, 115, 118, 119, 122, 123, 250, 355, 401, 411, 412, 413, 655]
maps = []

Dir.glob(File.join(root, "Map[0-9][0-9][0-9].rxdata")).sort.each do |path|
  map_id = File.basename(path)[3, 3].to_i
  map = Marshal.load(File.binread(path))
  events = (map.instance_variable_get(:@events) || {}).keys.sort.map do |event_id|
    event = map.instance_variable_get(:@events)[event_id]
    name = event.instance_variable_get(:@name).to_s
    pages = (event.instance_variable_get(:@pages) || []).each_with_index.map do |page, index|
      commands = (page.instance_variable_get(:@list) || []).map do |command|
        {"code" => command.instance_variable_get(:@code), "parameters" => command.instance_variable_get(:@parameters)}
      end
      script_lines = commands.select { |c| [355, 655].include?(c["code"]) }.map { |c| c["parameters"][0].to_s }
      script_lines.concat(commands.select { |c| c["code"] == 111 && c["parameters"][0] == 12 }.map { |c| c["parameters"][1].to_s })
      scripts = script_lines.join("\n")
      trainer = scripts.match(/TrainerBattle\.start\(:(\w+),\s*["']([^"']+)["'](?:,\s*(\d+))?\)/)
      rep = commands.select { |c| c["code"] == 122 && c["parameters"][0] == 29 }.map { |c| c["parameters"][4].to_i }.max
      switches = commands.select { |c| c["code"] == 123 }.map { |c| c["parameters"][0] }
      safe_scripts = script_lines.all? do |line|
        line =~ /\A(?:pbTrainerIntro\(:\w+\)|pbNoticePlayer\(get_self\)|pbTrainerEnd|TrainerBattle\.start\(:\w+,\s*["'][^"']+["'](?:,\s*\d+)?\))\z/
      end
      safe = !!trainer && name =~ /Trainer/i && commands.all? { |c| allowed_codes.include?(c["code"]) } && safe_scripts && rep && switches.length == 1
      {
        "page" => index, "command_codes" => commands.map { |c| c["code"] },
        "scripts" => script_lines.map(&:strip).reject(&:empty?),
        "trainer_battle" => (trainer ? {"type" => trainer[1], "name" => trainer[2], "version" => (trainer[3] || 0).to_i, "reputation" => rep, "self_switch" => switches[0]} : nil),
        "safe_scripts" => !!safe_scripts, "routine_allowlisted" => !!safe
      }
    end
    classification = if [4, 5, 6].include?(map_id)
      "PROTECTED_CAVE_CHAIN"
    elsif pages.any? { |p| p["routine_allowlisted"] }
      "MIXED_OR_ROUTINE_REVIEWED"
    else
      "PRESERVE"
    end
    {"event_id" => event_id, "name" => name, "classification" => classification, "pages" => pages}
  end
  maps << {"map_id" => map_id, "sha256" => Digest::SHA256.file(path).hexdigest, "events" => events}
end

document = {
  "schema_version" => 2,
  "policy" => "Only exact TrainerBattle pages using the command allowlist are routine candidates; all other pages are preserved.",
  "safe_command_codes" => allowed_codes,
  "maps" => maps
}
File.open(output, "wb") { |file| file.write(JSON.pretty_generate(document) + "\n") }
puts "audited #{maps.length} maps and #{maps.inject(0) { |n, m| n + m['events'].length }} events -> #{output}"
