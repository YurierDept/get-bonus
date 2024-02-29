import Viewer from 'viewerjs';

export function useImageViewer(container: Ref<HTMLElement | null | undefined>) {
  const viewer = ref<Viewer>();
  watch(container, async (container) => {
    if (!container) return;

    await nextTick();

    viewer.value = new Viewer(container, {
      viewed() {
        console.log('?');
      }
    });
  });

  onUpdated(() => {
    viewer?.value?.update();
  });

  onBeforeUnmount(() => {
    if (viewer.value) {
      viewer.value.destroy();
      viewer.value = undefined;
    }
  });

  return viewer;
}
