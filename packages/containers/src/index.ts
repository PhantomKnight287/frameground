import {
  FileSystemTree,
  WebContainer,
  WebContainerProcess,
} from "@webcontainer/api";

export async function createWebContainerInstance() {
  const webContainer = await WebContainer.boot();
  return webContainer;
}

export type WebContainerInstance = Awaited<
  ReturnType<typeof createWebContainerInstance>
>;

export type { FileSystemTree, WebContainerProcess };
