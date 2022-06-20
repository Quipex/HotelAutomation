import { TextFile, Adapter } from 'lowdb';
import YAML from 'yaml';

class YAMLFileAdapter<T> implements Adapter<T> {
  private adapter: TextFile;

  constructor(filename: string) {
    this.adapter = new TextFile(filename);
  }

  async read(): Promise<T | null> {
    const data = await this.adapter.read();
    if (data === null) {
      return null;
    }
    return YAML.parse(data) as T;
  }

  write(obj: T) {
    return this.adapter.write(YAML.stringify(obj));
  }
}

export { YAMLFileAdapter };
