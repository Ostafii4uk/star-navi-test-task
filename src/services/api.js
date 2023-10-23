const Api = {
  async getModes () {
    const res = await fetch('https://60816d9073292b0017cdd833.mockapi.io/modess');
    if (!res.ok) {
      throw new Error(`${res.status} = ${res.statusText}`);
    }
    return await res.json();
  }
}

export default Api