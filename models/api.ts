export interface Assists {
  recon_assists: number;
  assists: number;
  healing_done: number;
  defensive_assists: number;
  offensive_assists: number;
}

export interface Average {
  objective_contest_time_avg_per_10_min: number;
  assists_avg_per_10_min: number;
  objective_kills_avg_per_10_min: number;
  objective_time_avg_per_10_min: number;
  final_blows_avg_per_10_min: number;
  time_spent_on_fire_avg_per_10_min: number;
  solo_kills_avg_per_10_min: number;
  hero_damage_done_avg_per_10_min: number;
  eliminations_avg_per_10_min: number;
  deaths_avg_per_10_min: number;
  healing_done_avg_per_10_min: number;
}

export interface Best {
  eliminations_most_in_game: number;
  final_blows_most_in_game: number;
  all_damage_done_most_in_game: number;
  healing_done_most_in_game: number;
  defensive_assists_most_in_game: number;
  offensive_assists_most_in_game: number;
  objective_kills_most_in_game: number;
  objective_time_most_in_game: number;
  multikill_best: number;
  solo_kills_most_in_game: number;
  time_spent_on_fire_most_in_game: number;
  melee_final_blows_most_in_game: number;
  environmental_kills_most_in_game: number;
  kill_streak_best: number;
  hero_damage_done_most_in_game: number;
  barrier_damage_done_most_in_game: number;
  assists_most_in_game: number;
  objective_contest_time_most_in_game: number;
  recon_assists_most_in_game: number;
}

export interface Combat {
  multikills: number;
  time_spent_on_fire: number;
  melee_final_blows: number;
  objective_contest_time: number;
  environmental_kills: number;
  deaths: number;
  objective_kills: number;
  final_blows: number;
  objective_time: number;
  of_match_on_fire: number;
  eliminations: number;
  solo_kills: number;
  hero_damage_done: number;
  damage_done: number;
}

export interface Game {
  hero_wins: number;
  time_played: number;
  games_played: number;
  games_won: number;
  games_lost: number;
}

export interface MatchAwards {
  cards: number;
}

export interface AllHeroes {
  assists: Assists;
  average: Average;
  best: Best;
  combat: Combat;
  game: Game;
  match_awards: MatchAwards;
}

export interface PlayerStats {
  "all-heroes": AllHeroes;
}
