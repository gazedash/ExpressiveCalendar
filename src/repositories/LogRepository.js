// import { Log } from '../model/entity';
// import { UserRepository } from './index';
//
// export async function create({ type, data }) {
// 	const res = await Log.create({
// 		type,
// 		data
// 	});
// 	if (!res) {
// 		return null;
// 	}
// 	return res;
// }
//
// export async function find({ offset, limit, type, sort, userId = false }) {
// 	let where = {};
// 	let sortType = 'ASC';
// 	if (sort === 1) {
// 		sortType = 'DESC';
// 	}
// 	let order = [['id', sortType]];
// 	if (type) {
// 		where.type = type;
// 	}
// 	if (userId) {
// 		where.userId = userId;
// 	}
// 	const res = await Log.findAndCountAll({
// 		where,
// 		order,
// 		offset,
// 		limit
// 	});
// 	if (!res) {
// 		return null;
// 	}
// 	return res;
// }
//
// export async function createTypeForUser({ uid, type, data }) {
//   const user = await UserRepository.findByUuid(uid);
//
//   const log = await Log.create({
//     type: type,
//     data: data
//   });
//   if (!log) {
//     return null;
//   }
//   await user.addLog(log);
//   return log;
// }