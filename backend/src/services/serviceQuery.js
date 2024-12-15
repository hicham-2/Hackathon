export class GenericQuery {
  async findOneBy(object) {
    const slot = await this.model.findOne({
      where: object,
    });

    return slot;
  }

  async findAllBy(object) {
    const slots = await this.model.findAll({
      where: object,
    });

    return slots;
  }
}
