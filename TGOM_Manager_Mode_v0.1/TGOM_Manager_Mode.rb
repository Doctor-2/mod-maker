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
    :last_routine_map => nil
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

  # Observable, idempotent hook: Reputation milestones award tokens without
  # changing any of the game's progression variables.
  def sync_token_hooks
    return unless defined?($game_variables) && $game_variables
    reputation = $game_variables[REP_VARIABLE].to_i
    (100..reputation).step(100) { |n| claim_token("reputation_#{n}") }
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
    blocked = state[:blacklist] + state[:recent_scouts] + PROTECTED_SCOUTS
    unique = {}
    weighted_pool.each do |entry|
      next unless entry.is_a?(Array) && entry.length == 2 && entry[1].to_f > 0
      species = entry[0].to_sym
      next if blocked.include?(species)
      unique[species] = unique.fetch(species, 0.0) + entry[1].to_f
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
    return [] unless defined?(GameData::Species)
    pool = []
    GameData::Species.each do |species|
      next if species.form != 0 || species.pseudo_species != species.species
      next if species.respond_to?(:legendary?) && species.legendary?
      pool << [species.species, 1]
    end
    pool
  rescue StandardError
    []
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
        key = [map_id.to_i, event_id, switch]
        next if state[:cleared_routine_events][key]
        next if defined?($game_self_switches) && $game_self_switches && $game_self_switches[[map_id.to_i, event_id, switch]]
        money = delegated_money(type, name, version)
        next unless money
        $game_self_switches[[map_id.to_i, event_id, switch]] = true if defined?($game_self_switches) && $game_self_switches
        state[:cleared_routine_events][key] = true
        $player.money += money if defined?($player) && $player
        $game_variables[REP_VARIABLE] += reputation if defined?($game_variables) && $game_variables
        result[:battles] += 1; result[:money] += money; result[:reputation] += reputation
        log("ROUTINE_CLEAR map=#{map_id} event=#{event_id} trainer=#{type}/#{name}/#{version} money=#{money} reputation=#{reputation}")
        break # One currently reachable trainer page per event and delegation pass.
      end
    end
    sync_token_hooks
    result
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

  def recruit(species, level = nil)
    return false if state[:scout_tokens] < 1 || !defined?(Pokemon)
    level ||= opponent_central_level || 5
    pokemon = Pokemon.new(species, level)
    added = defined?(pbAddPokemonSilent) ? pbAddPokemonSilent(pokemon) : false
    return false unless added
    state[:scout_tokens] -= 1
    state[:recent_scouts] << species.to_sym
    state[:recent_scouts] = state[:recent_scouts].last(RECENT_LIMIT)
    log("RECRUIT species=#{species} level=#{level} tokens=#{state[:scout_tokens]}")
    true
  end

  def train_party
    target = opponent_central_level
    return 0 unless target && defined?($player) && $player
    changed = 0
    $player.party.each do |pokemon|
      next if !pokemon || pokemon.level >= target
      if defined?(pbChangeLevel); pbChangeLevel(pokemon, target, nil); else pokemon.level = target; end
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
    commands = ["Clear routine region", "Scout (#{state[:scout_tokens]} tokens)", "Blacklist", "Training", "Set Gym anchor", "Travel to Gym", "Return", "Cancel"]
    choice = pbMessage("Gym Staff", commands, commands.length - 1)
    case choice
    when 0
      result = clear_region
      pbMessage("Cleared #{result[:battles]} routine battles. Earned $#{result[:money]} and #{result[:reputation]} Reputation.")
    when 1
      candidates = scout_candidates(available_scout_pool)
      return pbMessage("No eligible candidates are available.") if candidates.empty?
      labels = candidates.map { |species| GameData::Species.get(species).name } + ["Cancel"]
      pick = pbMessage("Choose one recruit.", labels, labels.length - 1)
      recruit(candidates[pick]) if pick >= 0 && pick < candidates.length
    when 2
      candidates = scout_candidates(available_scout_pool)
      return pbMessage("No eligible candidates are available.") if candidates.empty?
      labels = candidates.map { |species| GameData::Species.get(species).name } + ["Cancel"]
      pick = pbMessage("Blacklist which candidate?", labels, labels.length - 1)
      blacklist(candidates[pick]) if pick >= 0 && pick < candidates.length
    when 3 then pbMessage("Trained #{train_party} Pokemon to the current opponent level.")
    when 4 then remember_gym
    when 5 then return :travel if travel_to_gym
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
EventHandlers.add(:on_end_battle, :tgom_manager_token_sync, proc { |*_| TGOMManager.sync_token_hooks })

if defined?(MenuHandlers)
  MenuHandlers.add(:pause_menu, :tgom_gym_staff, {
    "name" => _INTL("Gym Staff"),
    "order" => 65,
    "condition" => proc { next true },
    "effect" => proc do |menu|
      pbPlayDecisionSE
      menu.pbHideMenu
      if pbTGOMGymStaff == :travel
        menu.pbEndScene
        $game_temp.in_menu = false
        next true
      end
      menu.pbRefresh
      menu.pbShowMenu
      next false
    end
  })
end
