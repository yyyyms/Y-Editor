export interface IKey {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  /**
   * KeyboardEvent['code'] or '*'(match any key)
   */
  keyCode: string;
}
