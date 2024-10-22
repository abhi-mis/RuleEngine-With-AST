export interface Node {
  type: 'operator' | 'operand';
  value?: string | number;
  left?: Node;
  right?: Node;
}

export interface Rule {
  _id?: string;
  name: string;
  ast: Node;
}