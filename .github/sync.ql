/**
 * @kind problem
 * @id sync-methods
 * @severity medium
 */
 
import javascript

from CallExpr c
where c.getCalleeName() = "existsSync" or c.getCalleeName() = "readFileSync"
select c, "Sync method warning"

