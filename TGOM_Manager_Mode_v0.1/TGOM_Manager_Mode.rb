# TGOM Manager Mode v0.1
# Additive, save-compatible management systems for Essentials 20.1. Map events are
# never rewritten; only explicitly audited routine trainer self-switches are set.
module TGOMManager
  VERSION = 2
  PLUGIN_VERSION = "0.1.0"
  REP_VARIABLE = 29
  RECENT_LIMIT = 12
  DEFAULT_STATE = {
    :version => VERSION, :scout_tokens => 0, :blacklist => [],
    :recent_scouts => [], :cleared_routine_events => {},
    :claimed_token_sources => {}, :travel_origin => nil, :gym_location => nil,
    :last_routine_map => nil, :active_report => nil, :report_history => [],
    :observed_unlocks => {}
  }

  # Generated from audit/full_event_audit.json. A routine entry is admitted only
  # when every command on its battle pages matches audit_routine_events.rb's
  # allowlist. Story, boss, reward and Cave of Knowledge events are absent.
  SAFE_ROUTINE = {
    3 => {
      1 => [[:LASS, "Ellen", 0, 10, "A"], [:LASS, "Ellen", 1, 15, "B"]],
      2 => [[:YOUNGSTER, "Jeff", 0, 10, "A"], [:YOUNGSTER, "Jeff", 1, 15, "B"]],
      5 => [[:PICNICKER, "Liz", 0, 15, "A"], [:PICNICKER, "Liz", 1, 20, "B"]]
    },
    7 => {
      3 => [[:BUGCATCHER, "Bill", 0, 10, "A"]],
      4 => [[:ROCKER, "Ricky", 0, 20, "A"], [:ROCKER, "Ricky", 1, 25, "B"]],
      7 => [[:BEAUTY, "Missy", 0, 15, "A"], [:BEAUTY, "Missy", 1, 20, "B"]],
      11 => [[:CAMPER, "Jacob", 0, 20, "A"], [:CAMPER, "Jacob", 1, 25, "B"]]
    },
    8 => {
      2 => [[:HIKER, "Burton", 0, 15, "A"]],
      3 => [[:COOLTRAINER_F, "Linda", 0, 20, "A"], [:COOLTRAINER_F, "Linda", 1, 25, "B"]],
      4 => [[:SCIENTIST, "Gladstone", 0, 15, "A"]],
      5 => [[:CAMPER, "Timothy", 0, 20, "A"]]
    },
    10 => {
      4 => [[:COOLTRAINER_F, "Nat", 0, 30, "A"], [:COOLTRAINER_F, "Nat", 1, 35, "B"]],
      5 => [[:SUPERNERD, "Kevin", 0, 20, "A"]],
      6 => [[:BLACKBELT, "Dennis", 0, 20, "A"]],
      7 => [[:ROUGHRIDER_M, "Racer", 1, 20, "A"]]
    },
    21 => {
      23 => [[:CAMPER, "Davy", 0, 20, "A"]],
      24 => [[:BUGCATCHER, "Rob", 0, 20, "A"]],
      25 => [[:LASS, "Anna", 0, 20, "A"]],
      27 => [[:GENTLEMAN, "Chris", 0, 20, "A"]]
    }
  }.freeze
  ROUTINE_REGIONS = {
    :winding_woods => [3], :steel_caves => [7, 8, 10], :miser_marsh => [21]
  }.freeze
  # Exact audited RPG::Event::Page::Condition for each promoted battle page.
  # Empty hashes are unconditional; rematches carry their original Rank switch.
  ROUTINE_CONDITIONS = SAFE_ROUTINE.each_with_object({}) do |(map_id, events), maps|
    maps[map_id] = {}
    events.each do |event_id, specs|
      maps[map_id][event_id] = {}
      specs.each do |spec|
        rematch = [[3, 1], [3, 2], [3, 5], [7, 4], [7, 7], [7, 11],
                   [8, 3], [10, 4]].include?([map_id, event_id]) && spec[2] == 1
        maps[map_id][event_id][spec[2]] = rematch ? {:switch1 => 104} : {}
      end
    end
  end.freeze
  SAFE_GYM_MAPS = [15, 31, 43, 44, 45, 46, 47].freeze
  SAFE_RETURN_MAPS = [1, 2, 3, 7, 8, 9, 10, 11, 18, 19, 21, 26, 27, 28, 29,
                      30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 48, 49,
                      50, 51, 52, 54, 55, 56, 57, 58, 59].freeze
  PROTECTED_MAPS = [4, 5, 6].freeze
  PROTECTED_SCOUTS = [:CHARMANDER, :SQUIRTLE, :BULBASAUR, :CYNDAQUIL,
    :TOTODILE, :CHIKORITA, :TORCHIC, :MUDKIP, :TREECKO, :CHIMCHAR, :PIPLUP,
    :TURTWIG, :TEPIG, :OSHAWOTT, :SNIVY, :FENNEKIN, :FROAKIE, :CHESPIN,
    :LITTEN, :POPPLIO, :ROWLET, :SCORBUNNY, :SOBBLE, :GROOKEY, :FUECOCO,
    :QUAXLY, :SPRIGATITO].freeze
  PAGE_CONDITION = {:switch1 => 104}.freeze
  AREA_UNLOCKS = {110 => :badlands, 111 => :mirror_oasis}.freeze
  RANK_UNLOCKS = {104 => 1, 115 => 2}.freeze
  SCOUT_ENCOUNTER_MAPS = {2 => nil, 3 => nil, 7 => nil, 8 => nil, 10 => nil,
                          18 => 110, 54 => 111, 58 => 111, 59 => 111}.freeze
  GYM_BRACKETS = {
    0 => [[:LASS, "Ellen", 0], [:YOUNGSTER, "Jeff", 0], [:BUGCATCHER, "Bill", 0],
          [:ROCKER, "Ricky", 0], [:BEAUTY, "Missy", 0], [:PICNICKER, "Liz", 0]],
    1 => [[:LASS, "Ellen", 1], [:YOUNGSTER, "Jeff", 1], [:ROCKER, "Ricky", 1],
          [:BEAUTY, "Missy", 1], [:PICNICKER, "Liz", 1], [:COOLTRAINER_F, "Linda", 1]]
  }.freeze
  SAFE_DESTINATIONS = {
    :new_day_plain => [2, 45, 20, 8, nil],
    :winding_woods => [3, 25, 6, 2, nil],
    :even_badderlands => [18, 54, 15, 4, 110],
    :mirror_oasis => [54, 22, 20, 8, 111]
  }.freeze

  module_function

  def deep_copy(value); Marshal.load(Marshal.dump(value)); end

  def log(message)
    line = "[MANAGER] #{message}"
    if defined?(TGOMCompanion) && TGOMCompanion.respond_to?(:write_line)
      TGOMCompanion.write_line("MANAGER", message)
    elsif defined?(echoln)
      echoln(line)
    end
  rescue StandardError
  end

  def state
    return deep_copy(DEFAULT_STATE) unless defined?($PokemonGlobal) && $PokemonGlobal
    raw = $PokemonGlobal.tgom_manager_state
    unless raw.is_a?(Hash)
      raw = deep_copy(DEFAULT_STATE)
      $PokemonGlobal.tgom_manager_state = raw
      log("INIT v#{PLUGIN_VERSION}")
    end
    DEFAULT_STATE.each { |key, value| raw[key] = deep_copy(value) unless raw.key?(key) }
    raw[:version] = VERSION
    raw
  end

  def claim_token(source, amount = 1)
    id = source.to_s
    return false if id.empty? || amount.to_i < 1
    data = state
    return false if data[:claimed_token_sources][id]
    data[:claimed_token_sources][id] = true
    data[:scout_tokens] += amount.to_i
    log("SCOUT_TOKEN +#{amount.to_i} source=#{id} total=#{data[:scout_tokens]}")
    true
  end

  def sync_token_hooks
    return unless defined?($game_switches) && $game_switches
    RANK_UNLOCKS.each { |switch, rank| claim_token("rank_up_#{rank}") if $game_switches[switch] }
    AREA_UNLOCKS.each { |switch, area| claim_token("area_unlock_#{area}") if $game_switches[switch] }
    if $game_switches[101] && defined?($game_variables) && $game_variables && $game_variables[66].to_i >= 3
      claim_token("gym_shift_day_#{$game_variables[52].to_i}")
    end
  end

  def blacklist(species)
    id = species.to_sym
    return false if state[:blacklist].include?(id)
    state[:blacklist] << id
    log("BLACKLIST species=#{id}")
    true
  end

  def scout_candidates(weighted_pool, count = 3, random = Random)
    return [] unless weighted_pool.is_a?(Array)
    blocked = state[:blacklist] + PROTECTED_SCOUTS
    unique = {}
    weighted_pool.each do |entry|
      next unless entry.is_a?(Array) && entry.length == 2 && entry[1].to_f > 0
      species = entry[0].to_sym
      next if blocked.include?(species)
      reports_ago = state[:report_history].reverse.index { |report| report.include?(species) }
      decay = reports_ago && reports_ago < 2 ? 0.25 : 1.0
      unique[species] = unique.fetch(species, 0.0) + entry[1].to_f * decay
    end
    chosen = []
    [count.to_i, unique.length].min.times do
      pick = random.rand * unique.values.inject(0.0, :+)
      selected = unique.keys.find { |species| (pick -= unique[species]) < 0 }
      chosen << selected
      unique.delete(selected)
    end
    chosen
  end

  def available_scout_pool
    return [] unless defined?(GameData::Encounter) && defined?(GameData::Species)
    return [] if defined?($game_switches) && $game_switches && !$game_switches[76]
    pool = []
    SCOUT_ENCOUNTER_MAPS.each do |map_id, required_switch|
      next if required_switch && (!defined?($game_switches) || !$game_switches[required_switch])
      encounter = GameData::Encounter.get(map_id, 0) rescue nil
      next unless encounter
      encounter.types.each do |encounter_type, slots|
        tier = if defined?($player) && $player && $player.respond_to?(:badge_count) && $player.badge_count >= 5
                 5
               elsif defined?($player) && $player && $player.respond_to?(:badge_count) && $player.badge_count >= 3
                 3
               end
        suffix = encounter_type.to_s[/_(3|5)\z/, 1]
        next if tier && suffix && suffix.to_i != tier
        next if tier && !suffix && encounter.types.key?((encounter_type.to_s + "_#{tier}").to_sym)
        next if !tier && suffix
        slots.each do |weight, species, _min_level, _max_level|
          data = GameData::Species.get(species) rescue nil
          next unless data && data.types.include?(:FIRE)
          pool << [species, weight]
        end
      end
    end
    pool
  rescue StandardError
    []
  end

  def create_report(random = Random)
    return state[:active_report] if state[:active_report]
    return nil if state[:scout_tokens] < 1
    candidates = scout_candidates(available_scout_pool, 3, random)
    return nil if candidates.empty?
    state[:scout_tokens] -= 1
    state[:active_report] = candidates
    state[:report_history] << candidates
    state[:report_history] = state[:report_history].last(2)
    log("SCOUT_REPORT candidates=#{candidates.join(',')} tokens=#{state[:scout_tokens]}")
    candidates
  end

  def resolve_report(recruit_species = nil, blacklist_species = nil)
    report = state[:active_report]
    return false unless report
    return false if recruit_species && !report.include?(recruit_species.to_sym)
    return false if blacklist_species && (!report.include?(blacklist_species.to_sym) || (recruit_species && blacklist_species.to_sym == recruit_species.to_sym))
    return false if recruit_species && !recruit(recruit_species, nil, false)
    blacklist(blacklist_species) if blacklist_species
    state[:active_report] = nil
    log("SCOUT_RESOLVE recruit=#{recruit_species || 'none'} blacklist=#{blacklist_species || 'none'}")
    true
  end

  def region_maps(map_id)
    ROUTINE_REGIONS.values.find { |entries| entries.include?(map_id.to_i) } || []
  end

  def opponent_central_level(map_id = nil)
    map_id ||= (defined?($game_map) && $game_map ? $game_map.map_id : nil)
    maps = region_maps(map_id)
    maps = region_maps(state[:last_routine_map]) if maps.empty?
    specs = maps.map { |id| SAFE_ROUTINE.fetch(id, {}).values.flatten(1) }.flatten(1)
    levels = specs.map { |spec| trainer_levels(spec[0], spec[1], spec[2]) }.flatten.sort
    return nil if levels.empty?
    levels.inject(0, :+) / levels.length
  end

  def trainer_levels(type, name, version = 0)
    return [] unless defined?(GameData::Trainer)
    trainer = GameData::Trainer.get(type, name, version)
    trainer.pokemon.map { |pokemon| pokemon[:level].to_i }
  rescue StandardError
    []
  end

  def delegated_money(type, name, version = 0)
    levels = trainer_levels(type, name, version)
    return nil if levels.empty? || !defined?(GameData::TrainerType)
    levels.max * GameData::TrainerType.get(type).base_money.to_i
  rescue StandardError
    nil
  end

  def clear_map(map_id)
    map_id ||= (defined?($game_map) && $game_map ? $game_map.map_id : nil)
    events = SAFE_ROUTINE[map_id.to_i]
    return {:battles => 0, :money => 0, :reputation => 0} unless events
    result = {:battles => 0, :money => 0, :reputation => 0}
    events.each do |event_id, specs|
      specs.each do |spec|
        type, name, version, reputation, switch = spec
        condition = ROUTINE_CONDITIONS.fetch(map_id.to_i).fetch(event_id).fetch(version)
        next unless page_condition_met?(condition, map_id, event_id)
        key = [map_id.to_i, event_id, switch]
        next if state[:cleared_routine_events][key]
        next if defined?($game_self_switches) && $game_self_switches && $game_self_switches[[map_id.to_i, event_id, switch]]
        money = delegated_money(type, name, version)
        next unless money
        $game_self_switches[[map_id.to_i, event_id, switch]] = true if defined?($game_self_switches) && $game_self_switches
        state[:cleared_routine_events][key] = true
        if defined?($player) && $player
          old_money = $player.money
          $player.money += money
          gained = $player.money - old_money
          $stats.battle_money_gained += gained if gained > 0 && defined?($stats) && $stats
        end
        if defined?($game_variables) && $game_variables
          $game_variables[REP_VARIABLE] += reputation
          $game_variables[34] = $game_variables[REP_VARIABLE] if $game_variables[REP_VARIABLE] > $game_variables[34]
        end
        result[:battles] += 1; result[:money] += money; result[:reputation] += reputation
        log("ROUTINE_CLEAR map=#{map_id} event=#{event_id} trainer=#{type}/#{name}/#{version} money=#{money} reputation=#{reputation}")
        break # One currently reachable trainer page per event and delegation pass.
      end
    end
    sync_token_hooks
    result
  end

  def page_condition_met?(condition, map_id, event_id)
    return false if condition[:switch1] && (!defined?($game_switches) || !$game_switches[condition[:switch1]])
    return false if condition[:switch2] && (!defined?($game_switches) || !$game_switches[condition[:switch2]])
    if condition[:variable]
      return false if !defined?($game_variables) || $game_variables[condition[:variable][0]].to_i < condition[:variable][1]
    end
    if condition[:self_switch]
      return false if !defined?($game_self_switches) || !$game_self_switches[[map_id, event_id, condition[:self_switch]]]
    end
    true
  end

  def clear_region(map_id = nil)
    map_id ||= (defined?($game_map) && $game_map ? $game_map.map_id : nil)
    total = {:battles => 0, :money => 0, :reputation => 0}
    region_maps(map_id).each do |id|
      result = clear_map(id)
      total.keys.each { |key| total[key] += result[key] }
    end
    total
  end

  def recruit(species, level = nil, consume_token = true)
    return false if (consume_token && state[:scout_tokens] < 1) || !defined?(Pokemon)
    level ||= gym_training_target || 5
    pokemon = Pokemon.new(species, level)
    added = defined?(pbAddPokemonSilent) ? pbAddPokemonSilent(pokemon) : false
    return false unless added
    state[:scout_tokens] -= 1 if consume_token
    log("RECRUIT species=#{species} level=#{level} tokens=#{state[:scout_tokens]}")
    true
  end

  def gym_rank
    return 2 if defined?($game_switches) && $game_switches && $game_switches[115]
    return 1 if defined?($game_switches) && $game_switches && $game_switches[104]
    0
  end

  def gym_training_target
    bracket = GYM_BRACKETS[gym_rank] || GYM_BRACKETS[GYM_BRACKETS.keys.max]
    levels = bracket.flat_map { |type, name, version| trainer_levels(type, name, version) }
    return nil if levels.empty?
    levels.inject(0, :+) / levels.length
  end

  class TrainingScene
    def pbRefresh; end
    def pbUpdate
      Graphics.update if defined?(Graphics)
      Input.update if defined?(Input)
    end
  end

  def train_party(scene = TrainingScene.new)
    target = gym_training_target
    return 0 unless target && defined?($player) && $player
    changed = 0
    $player.party.each do |pokemon|
      next if !pokemon || pokemon.level >= target
      if defined?(pbChangeLevel); pbChangeLevel(pokemon, target, scene); else pokemon.level = target; end
      changed += 1
    end
    log("TRAIN target=#{target} pokemon=#{changed}")
    changed
  end

  def remember_gym
    return false unless defined?($game_map) && $game_map && defined?($game_player) && $game_player
    return false unless SAFE_GYM_MAPS.include?($game_map.map_id)
    state[:gym_location] = [$game_map.map_id, $game_player.x, $game_player.y, $game_player.direction]
    log("GYM_ANCHOR #{state[:gym_location].join(',')}")
    true
  end

  def travel_to_gym
    location = state[:gym_location]
    return false unless location && SAFE_GYM_MAPS.include?(location[0]) && travel_idle?
    if defined?($game_map) && $game_map && defined?($game_player) && $game_player
      return false unless SAFE_RETURN_MAPS.include?($game_map.map_id)
      state[:travel_origin] = [$game_map.map_id, $game_player.x, $game_player.y, $game_player.direction]
    end
    transfer(location)
  end

  def return_from_gym
    location = state[:travel_origin]
    return false unless location && SAFE_RETURN_MAPS.include?(location[0]) && travel_idle?
    return false unless transfer(location)
    state[:travel_origin] = nil
    true
  end

  def available_destinations
    SAFE_DESTINATIONS.select do |_name, location|
      required_switch = location[4]
      !required_switch || (defined?($game_switches) && $game_switches && $game_switches[required_switch])
    end
  end

  def travel_to_destination(name)
    location = available_destinations[name.to_sym]
    return false unless location && travel_idle?
    transfer(location[0, 4])
  end

  def important_loss(outcome, can_lose)
    return false unless outcome == 2 && can_lose
    return false unless defined?($game_map) && $game_map && defined?(pbMapInterpreter) && pbMapInterpreterRunning?
    event = pbMapInterpreter.get_self rescue nil
    return false unless event
    return false if SAFE_ROUTINE.fetch($game_map.map_id, {}).key?(event.id)
    claim_token("emergency_loss_map_#{$game_map.map_id}_event_#{event.id}")
  end

  def travel_idle?
    return false if defined?(pbMapInterpreterRunning?) && pbMapInterpreterRunning?
    true
  end

  def transfer(location)
    return false unless defined?($game_temp) && $game_temp && defined?($game_player) && $game_player
    $game_temp.player_new_map_id = location[0]; $game_temp.player_new_x = location[1]
    $game_temp.player_new_y = location[2]; $game_temp.player_new_direction = location[3]
    $game_temp.player_transferring = true
    $game_player.cancel_vehicles if $game_player.respond_to?(:cancel_vehicles)
    log("TRAVEL destination=#{location.join(',')}")
    true
  end

  def gym_staff_menu
    commands = ["Clear routine region", "Scout (#{state[:scout_tokens]} tokens)", "Training", "Set Gym anchor", "Travel to Gym", "Story destinations", "Return", "Cancel"]
    choice = pbMessage("Gym Staff", commands, commands.length - 1)
    case choice
    when 0
      result = clear_region
      pbMessage("Cleared #{result[:battles]} routine battles. Earned $#{result[:money]} and #{result[:reputation]} Reputation.")
    when 1
      candidates = create_report
      return pbMessage("No eligible candidates are available.") if !candidates || candidates.empty?
      labels = candidates.map { |species| GameData::Species.get(species).name } + ["Reject all", "Keep report"]
      pick = pbMessage("Choose one recruit or reject this report.", labels, labels.length - 1)
      if pick >= 0 && pick < candidates.length
        rejected = candidates.reject { |species| species == candidates[pick] }
        black_labels = rejected.map { |species| GameData::Species.get(species).name } + ["No blacklist"]
        black_pick = pbMessage("Optionally blacklist one rejected species.", black_labels, black_labels.length - 1)
        blacklisted = rejected[black_pick] if black_pick >= 0 && black_pick < rejected.length
        resolve_report(candidates[pick], blacklisted)
      elsif pick == candidates.length
        black_labels = candidates.map { |species| GameData::Species.get(species).name } + ["No blacklist"]
        black_pick = pbMessage("Optionally blacklist one rejected species.", black_labels, black_labels.length - 1)
        resolve_report(nil, candidates[black_pick]) if black_pick >= 0 && black_pick < candidates.length
        resolve_report unless state[:active_report].nil?
      end
    when 2
      pbMessage("Trained #{train_party} Pokemon to the current Gym challenger bracket.")
    when 3 then remember_gym
    when 4 then return :travel if travel_to_gym
    when 5
      destinations = available_destinations.keys
      labels = destinations.map { |name| name.to_s.split('_').map(&:capitalize).join(' ') } + ["Cancel"]
      pick = pbMessage("Choose an unlocked safe entrance.", labels, labels.length - 1)
      return :travel if pick >= 0 && pick < destinations.length && travel_to_destination(destinations[pick])
    when 6 then return :travel if return_from_gym
    end
    :stay
  end
end

class PokemonGlobalMetadata
  attr_accessor :tgom_manager_state
end

class PokemonEncounters
  alias tgom_manager_original_encounter_triggered encounter_triggered?
  def encounter_triggered?(enc_type, repel_active = false, triggered_by_step = true)
    return false if triggered_by_step
    tgom_manager_original_encounter_triggered(enc_type, repel_active, triggered_by_step)
  end
end

def pbTGOMGymStaff; TGOMManager.gym_staff_menu; end

EventHandlers.add(:on_game_map_setup, :tgom_manager_initialize, proc do |map_id|
  TGOMManager.state
  TGOMManager.state[:last_routine_map] = map_id if !TGOMManager.region_maps(map_id).empty?
  TGOMManager.sync_token_hooks
end)
EventHandlers.add(:on_end_battle, :tgom_manager_token_sync, proc do |outcome, can_lose|
  TGOMManager.sync_token_hooks
  TGOMManager.important_loss(outcome, can_lose)
end)

if defined?(MenuHandlers)
  MenuHandlers.add(:pokegear_menu, :tgom_gym_staff, {
    "name" => _INTL("Gym Staff"),
    "icon_name" => "phone",
    "order" => 25,
    "condition" => proc { next true },
    "effect" => proc do |menu|
      if pbTGOMGymStaff == :travel
        menu.dispose
        next 99999
      end
      next false
    end
  })
end
