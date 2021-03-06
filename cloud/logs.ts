/**
 * This module should not be used by consumers of this library.
 * @private
 */

import { LogEntry } from 'blockheads-api-interface'

/**
 * Parses logs from the portal into a standard format. If you are consuming this library, you don't need to know anything about it.
 * @private
 */
export class LogParser {
  private entries: LogEntry[]

  /**
   * Creates a new instance of the LogParser class.
   */
  constructor() {
    this.entries = []
  }

  /**
   * Parses the logs into a standard format.
   *
   * @param lines the raw log lines.
   */
  parse = (lines: string[]): LogEntry[] => {
    // Copy the lines array
    lines = lines.slice(0)

    // Assume first line is valid, if it isn't it will be dropped.
    for (let i = lines.length - 1; i > 0; i--) {
      const line = lines[i]

      if (!this.isValidLine(line)) {
        lines[i - 1] += '\n' + lines.splice(i, 1)
        continue
      }

      this.addLine(line)
    }

    if (this.isValidLine(lines[0])) {
      this.addLine(lines[0])
    }

    const entries = this.entries.reverse()
    this.entries = []

    return entries
  }

  private isValidLine = (line: string): boolean => {
    return /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\.\d{3} blockheads_server/.test(line)
  }

  private addLine = (line: string): void => {
    const ts = line.substr(0, 24)
      .replace(' ', 'T')
      .replace(' ', 'Z')

    this.entries.push({
      raw: line,
      timestamp: new Date(ts),
      message: line.substr(line.indexOf(']') + 2)
    })
  }
}
