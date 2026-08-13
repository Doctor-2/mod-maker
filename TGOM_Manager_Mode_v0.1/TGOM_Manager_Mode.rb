# TGOM Manager Mode v0.1 — conservative, save-compatible core.
# Unknown content is deliberately preserved. No map or save is rewritten.
module TGOMManager
  VERSION = 1
  PLUGIN_VERSION = "0.1"
  DEFAULT_STATE = {
    :version => VERSION, :scout_tokens => 0, :blacklist => [],
    :recent_scouts => [], :cleared_routine_events => {},
    :claimed_token_sources => {}, :emergency_loss_sources => {}
  }
  # No map is eligible until a human audit records every battle/reward page.
  SAFE_ROUTINE = {}.freeze
  SAFE_TRAVEL = {}.freeze

  def self.log(message)
    line = "[MANAGER] #{message}"
    echoln(line) if defined?(echoln)
    if defined?(TGOMCompanionLogger) && TGOMCompanionLogger.respond_to?(:log)
      TGOMCompanionLogger.log(line)
    end
  rescue StandardError
    # Logging must never affect play.
  end

  def self.state
    return Marshal.load(Marshal.dump(DEFAULT_STATE)) unless defined?($PokemonGlobal) && $PokemonGlobal
    raw = $PokemonGlobal.tgom_manager_state
    unless raw.is_a?(Hash)
      raw = Marshal.load(Marshal.dump(DEFAULT_STATE))
      $PokemonGlobal.tgom_manager_state = raw
      log("INIT v#{PLUGIN_VERSION}")
      log("RANDOM_ENCOUNTERS disabled")
    end
    DEFAULT_STATE.each { |key, value| raw[key] = Marshal.load(Marshal.dump(value)) unless raw.key?(key) }
    raw[:version] = VERSION
    raw
  end

  def self.claim_token(source)
    id = source.to_s
    return false if id.empty?
    data = state
    return false if data[:claimed_token_sources][id]
    data[:claimed_token_sources][id] = true
    data[:scout_tokens] += 1
    log("SCOUT_TOKEN +1 source=#{id}")
    true
  end

  def self.blacklist(species)
    id = species.to_sym
    return false if state[:blacklist].include?(id)
    state[:blacklist] << id
    log("BLACKLIST species=#{id}")
    true
  end

  # Pure selection helper. Callers must supply an already audited/unlocked pool.
  def self.scout_candidates(weighted_pool, count = 3, random = Random)
    return [] unless weighted_pool.is_a?(Array)
    blocked = state[:blacklist]
    pool = weighted_pool.select { |entry| entry.is_a?(Array) && entry.length == 2 && entry[1].to_f > 0 && !blocked.include?(entry[0].to_sym) }
    unique = {}
    pool.each { |species, weight| unique[species.to_sym] = unique.fetch(species.to_sym, 0.0) + weight.to_f }
    chosen = []
    [count, unique.length].min.times do
      total = unique.values.inject(0.0, :+)
      pick = random.rand * total
      selected = unique.each { |species, weight| break species if (pick -= weight) < 0 }
      selected = selected.is_a?(Array) ? selected[0] : selected
      chosen << selected
      unique.delete(selected)
    end
    chosen
  end

  def self.delegated_money(max_level, base_money)
    return nil unless max_level.is_a?(Integer) && base_money.is_a?(Integer)
    return nil if max_level < 1 || base_money < 0
    max_level * base_money
  end
end

class PokemonGlobalMetadata
  attr_accessor :tgom_manager_state
end

# Essentials 20.1's narrow step-roll hook. Scripted WildBattle.start/pbWildBattle,
# fishing, event encounters, and calls with triggered_by_step=false are untouched.
class PokemonEncounters
  alias tgom_manager_original_encounter_triggered encounter_triggered?
  def encounter_triggered?(enc_type, repel_active = false, triggered_by_step = true)
    return false if triggered_by_step
    tgom_manager_original_encounter_triggered(enc_type, repel_active, triggered_by_step)
  end
end

EventHandlers.add(:on_game_map_setup, :tgom_manager_initialize, proc { |_map_id| TGOMManager.state })
