import { defineStore } from 'pinia';


export const useContainerStore = defineStore('containerStore', {
  state: () => ({
    containers: [] as any[],
  }),
  actions: {
    async getContainer(bl_number: string) {
      try {
        const formData = new FormData();
        formData.append("bl_number", bl_number);
        const req = await fetch("https://api.efl.africa/api/track", {
          method: "POST",
          body: formData,
        });

        const res = await req.json();
        console.log(res.data)
        this.containers = [...res.data];
      } catch (error) {
        console.error(error);
      }
    },
  },
});