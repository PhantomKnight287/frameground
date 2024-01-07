import { FileSystemTree, WebContainer } from "@webcontainer/api";

export async function createWebContainerInstance(files: FileSystemTree) {
  const webContainer = await WebContainer.boot();
  await webContainer.mount(files);
  return webContainer;
}
