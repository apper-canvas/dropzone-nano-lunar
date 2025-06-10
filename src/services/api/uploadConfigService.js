import uploadConfig from '../mockData/uploadConfig.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UploadConfigService {
  constructor() {
    this.config = { ...uploadConfig };
  }

  async getConfig() {
    await delay(100);
    return { ...this.config };
  }

  async updateConfig(newConfig) {
    await delay(200);
    this.config = { ...this.config, ...newConfig };
    return { ...this.config };
  }
}

export default new UploadConfigService();