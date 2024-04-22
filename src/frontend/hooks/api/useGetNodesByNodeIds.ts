import { UseQueryOptions, useQueries } from "@tanstack/react-query";

import * as api from "../../../backend/api";
import Node from "backend/schema/node";

const useGetNodesByNodeIds = (nodeIds: string[]) => {
    return useQueries<UseQueryOptions<{ data: Node }>[]>(
        {
            queries: nodeIds.map(
                (nodeId) => {
                    return {
                        queryKey: ['node', nodeId],
                        queryFn: () => api.getNodeById(nodeId),
                        staleTime: Infinity,
                    }
                }
            ),
        }
    );
}

export default useGetNodesByNodeIds;
