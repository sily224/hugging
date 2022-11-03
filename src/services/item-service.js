import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category, Item } from "../db";
class ItemService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async addItem(data) {
    const { category } = data;
    const isCategory = await Category.findOne({ name: category });
    if (!isCategory) {
      throw new Error("해당 카테고리는 없습니다.");
    }
    // 아래는 생성
    const newItem = await Item.create(data);
    //아래는 카테고리 업데이트
    await Category.updateOne({}, { $push: { items: newItem._id } });
    return newItem;
  }
  // 관리자페이지에서 items CRUD 에 필요한 함수
  async adminFindItems() {
    const items = await Item.find({});
    return items;
  }
  // newItems와 bestItems 를 리턴하는 함수
  async homeFindItems() {
    const bestItems = await Item.find({}).sort({ sales: -1 }).limit(8);
    const newItems = await Item.find({}).sort({ createdAt: -1 }).limit(3);
    return { newItems, bestItems };
  }

  // 상품상세페이지를 위한 데이터 리턴
  async detailViewItem(findId) {
    //id값을 받아 해당 id의 아이템 정보 리턴
    const findItem = await Item.findById({ _id: findId });
    return findItem;
  }
}

const itemService = new ItemService();

export { itemService };