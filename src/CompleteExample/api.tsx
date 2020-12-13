export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  birthday: string;
  picture: string;
}

const users: Array<IUser> = [
  {
    id: 101,
    firstname: "Luffy",
    lastname: "Monkey D",
    birthday: "1997-05-07",
    picture:
      "https://static.wikia.nocookie.net/onepiece/images/6/6d/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png",
  },
  {
    id: 102,
    firstname: "Zoro",
    lastname: "Roronoa",
    birthday: "1997-11-11",
    picture:
      "https://static.wikia.nocookie.net/onepiece/images/5/52/Roronoa_Zoro_Anime_Post_Timeskip_Infobox.png",
  },
];

export async function getUser(userId: number): Promise<IUser> {
  await sleep();
  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error(`not found`);
  }
  return user;
}

export async function setUser(updatedUser: IUser): Promise<void> {
  await sleep();

  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index === -1) {
    throw new Error(`not found`);
  }

  const oldUser = users[index];
  users[index] = { ...oldUser, ...updatedUser };
}

export function sleep(time = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
