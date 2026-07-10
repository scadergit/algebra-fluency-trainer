export interface SessionRecord {
  /** ISO timestamp when the session ended */
  completedAt: string;

  /** Duration selected by the student, in seconds */
  durationSeconds: number;

  /** Skills that were enabled during the session */
  skills: string[];

  correct: number;
  incorrect: number;
  bestStreak: number;

  /**
   * Average milliseconds taken to answer each attempted question (all skills).
   * Undefined for sessions recorded before this field was added.
   * @deprecated No longer shown in the table; kept for backwards compatibility.
   */
  avgResponseMs?: number;

  /**
   * Average milliseconds per skill, keyed by topic name (e.g. "addition").
   * Undefined for sessions recorded before this field was added.
   */
  avgResponseMsBySkill?: Record<string, number>;

  /**
   * Number of times each skill was prompted (attempted + skipped) during the
   * session, keyed by topic name.
   * Undefined for sessions recorded before this field was added.
   */
  promptCountBySkill?: Record<string, number>;

  /**
   * Number of correct answers per skill during the session, keyed by topic name.
   * Undefined for sessions recorded before this field was added.
   */
  correctCountBySkill?: Record<string, number>;

  /**
   * Number of attempted (correct + incorrect) answers per skill during the session,
   * keyed by topic name.
   * Undefined for sessions recorded before this field was added.
   */
  attemptedCountBySkill?: Record<string, number>;
}
