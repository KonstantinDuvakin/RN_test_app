import { initOnlineManager } from '../shared/query/onlineManager.ts';
import { registerTaskMutations } from '../features/tasks/mutations/taskMutationDefaults.ts';

initOnlineManager();
registerTaskMutations()
