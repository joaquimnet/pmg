import { SchemaDefinition } from 'mongoose';

export interface PMGModel {
  name: string;
  schema: SchemaDefinition;
  methods: Record<string, (...args: any[]) => any>;
  statics: Record<string, (...args: any[]) => any>;
  inherit: PMGModel[];
}
