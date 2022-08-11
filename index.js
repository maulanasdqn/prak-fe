const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const url = "http://localhost:7000/mahasiswa";

    const mahasiswa = ref({
      id: null,
      name: "",
      email: "",
      nim: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });

    const getMahasiswa = async () => {
      try {
        mahasiswa.value.isUpdate = false;
        const resMahasiswa = await axios.get(url);
        if (resMahasiswa.data.length === 0)
          throw new Error("Mahasiswa gak ada");
        mahasiswa.value.list = resMahasiswa.data;
        return resMahasiswa.data;
      } catch (err) {
        mahasiswa.value.isError = true;
        mahasiswa.value.errorMessage = err.message;
        mahasiswa.value.isUpdate = false;
      }
    };

    const getMahasiswaById = async (id) => {
      try {
        const resMahasiswa = await axios.get(url + `/${id}`);
        if (resMahasiswa.data.length === 0)
          throw new Error("Mahasiswa gak ada");
        mahasiswa.value.isUpdate = true;
        mahasiswa.value.id = id;
        mahasiswa.value.name = resMahasiswa.data.name;
        mahasiswa.value.email = resMahasiswa.data.email;
        mahasiswa.value.nim = resMahasiswa.data.nim;
        return resMahasiswa.data;
      } catch (err) {
        mahasiswa.value.name = "";
        mahasiswa.value.email = "";
        mahasiswa.value.nim = "";
        mahasiswa.value.isUpdate = false;
        mahasiswa.value.isError = true;
        mahasiswa.value.errorMessage = err.message;
      }
    };

    const deleteMahasiswa = async (id) => {
      try {
        mahasiswa.value.isUpdate = false;
        const resMahasiswa = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resMahasiswa.data.length === 0)
          throw new Error("Mahasiswa gak ada");
        mahasiswa.value.list = resMahasiswa.data;
        await getMahasiswa();
        return resMahasiswa.data;
      } catch (err) {
        mahasiswa.value.isError = true;
        mahasiswa.value.errorMessage = err.message;
      }
    };

    const submitMahasiswa = async () => {
      try {
        mahasiswa.value.isUpdate = false;
        const post = await axios.post(url + "/create", {
          name: mahasiswa.value.name,
          email: mahasiswa.value.email,
          nim: mahasiswa.value.nim,
        });
        mahasiswa.value.isError = false;
        mahasiswa.value.name = "";
        mahasiswa.value.email = "";
        mahasiswa.value.nim = "";
        mahasiswa.value.isUpdate = false;
        if (!post) throw new Error("Gagal membuat mahasiswa");
        await getMahasiswa();
      } catch (err) {
        mahasiswa.value.isError = true;
        mahasiswa.value.errorMessage = err.message;
      }
    };

    const updateMahasiswa = async () => {
      try {
        mahasiswa.value.isUpdate = true;
        const put = await axios.put(url + "/update", {
          id: mahasiswa.value.id,
          name: mahasiswa.value.name,
          email: mahasiswa.value.email,
          nim: mahasiswa.value.nim,
        });
        mahasiswa.value.isError = false;
        mahasiswa.value.name = "";
        mahasiswa.value.email = "";
        mahasiswa.value.nim = "";
        mahasiswa.value.isUpdate = false;
        mahasiswa.value.isError = true;
        if (!put) throw new Error("Gagal mengapdate mahasiswa");
        await getMahasiswa();
      } catch (err) {
        mahasiswa.value.isUpdate = false;
        mahasiswa.value.isError = true;
        mahasiswa.value.errorMessage = err.message;
      }
    };

    onMounted(async () => {
      await getMahasiswa();
    });

    return {
      mahasiswa,
      submitMahasiswa,
      updateMahasiswa,
      deleteMahasiswa,
      getMahasiswaById,
    };
  },
});

app.mount("#app");
