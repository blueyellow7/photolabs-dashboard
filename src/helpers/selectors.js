export function getTotalPhotos(state) {
  return state.photos.length;
}

export function getTotalTopics(state) {
  return state.topics.length;
}

export function getUserWithMostUploads(state) {
  const arrayOfNames = state.photos.map((photo)=> photo.user.name);
  const objectOfNames = {};
  arrayOfNames.forEach(name => objectOfNames[name] ? objectOfNames[name] ++ : objectOfNames[name] = 1)
  const filteredNames = Object.keys(objectOfNames).filter(x => {
    return objectOfNames[x] === Math.max.apply(null, Object.values(objectOfNames));
  })
  return filteredNames[0];
}

export function getUserWithLeastUploads(state) {
  const arrayOfNames = state.photos.map((photo)=> photo.user.name);
  const objectOfNames = {};
  arrayOfNames.forEach(name => objectOfNames[name] ? objectOfNames[name] ++ : objectOfNames[name] = 1)
  const filteredNames = Object.keys(objectOfNames).filter(x => {
    return objectOfNames[x] === Math.min.apply(null, Object.values(objectOfNames));
  })
  return filteredNames[0];
}