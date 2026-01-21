/*
Map over error object like this 
  {"info.houseTariff.branch_id": [""]]} 
and turn into like this 
  {"info": {"houseTariff": {"branch_id": [""]}}}
*/
export const formatErrors = (errors: Record<string, string[]>) => {
  return Object.entries(errors).reduce((acc: any, [path, value]) => {
    const keys = path.split('.');
    let current = acc;

    keys.forEach((key, idx) => {
      const isLast = idx === keys.length - 1;
      const isIndex = !isNaN(Number(key));

      if (isLast) {
        if (isIndex) {
          current[Number(key)] = value;
        } else {
          current[key] = value;
        }
        return;
      }

      if (isIndex) {
        const index = Number(key);
        if (!Array.isArray(current)) {
          current = [];
        }
        if (!current[index]) {
          current[index] = {};
        }
        current = current[index];
      } else {
        if (!current[key]) {
          const nextKey = keys[idx + 1];
          current[key] = !isNaN(Number(nextKey)) ? [] : {};
        }
        current = current[key];
      }
    });

    return acc;
  }, {});
};
