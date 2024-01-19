import { FileSystemTree, WebContainer } from "@webcontainer/api";

export async function createWebContainerInstance() {
  const webContainer = await WebContainer.boot();
  return webContainer;
}

export type WebContainerInstance = Awaited<
  ReturnType<typeof createWebContainerInstance>
>;

export { FileSystemTree };
