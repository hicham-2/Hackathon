export class GenericQuery {
  async findOneBy(object) {
    const slot = await this.model.findOne({
      where: object,
    });

    return slot;
  }
}
