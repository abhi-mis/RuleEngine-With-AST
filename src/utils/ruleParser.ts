import { Node } from '../types/Rule';

export function createRule(ruleString: string): Node {
  const tokens = ruleString.match(/\(|\)|\w+|[<>=]+|\d+|'[^']*'/g) || [];
  
  function parseExpression(): Node {
    if (tokens[0] === '(') {
      tokens.shift(); // Remove opening parenthesis
      const left = parseExpression();
      const operator = tokens.shift();
      const right = parseExpression();
      tokens.shift(); // Remove closing parenthesis
      return { type: 'operator', value: operator, left, right };
    } else {
      const left = tokens.shift();
      const operator = tokens.shift();
      const right = tokens.shift();
      return { type: 'operand', value: `${left} ${operator} ${right}` };
    }
  }

  return parseExpression();
}

export function combineRules(rules: Node[]): Node {
  if (rules.length === 0) return { type: 'operand', value: 'true' };
  if (rules.length === 1) return rules[0];
  
  return rules.reduce((combined, rule) => ({
    type: 'operator',
    value: 'AND',
    left: combined,
    right: rule
  }));
}

export function evaluateRule(ast: Node, data: Record<string, any>): boolean {
  if (ast.type === 'operand') {
    const [attribute, operator, value] = (ast.value as string).split(' ');
    const dataValue = data[attribute];
    const compareValue = value.replace(/'/g, '');
    
    switch (operator) {
      case '>': return dataValue > Number(compareValue);
      case '<': return dataValue < Number(compareValue);
      case '=': return dataValue === compareValue;
      case '>=': return dataValue >= Number(compareValue);
      case '<=': return dataValue <= Number(compareValue);
      default: return false;
    }
  } else if (ast.type === 'operator') {
    const leftResult = evaluateRule(ast.left!, data);
    const rightResult = evaluateRule(ast.right!, data);
    
    switch (ast.value) {
      case 'AND': return leftResult && rightResult;
      case 'OR': return leftResult || rightResult;
      default: return false;
    }
  }
  
  return false;
}