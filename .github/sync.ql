/**
 * @kind problem
 * @id sync-methods
 * @problem.severity warning
 */
 
import javascript

from CallExpr c
where c.getCalleeName() = "existsSync" or c.getCalleeName() = "readFileSync"
select c, "Sync method warning"

