-- Simulate PostgreSQL trigram extension in H2
CREATE ALIAS IF NOT EXISTS SIMILARITY FOR "org.h2.util.StringUtils.equals";

-- Simulate array_to_string
CREATE ALIAS IF NOT EXISTS ARRAY_TO_STRING AS '
    String arrayToString(Object[] array, String delimiter) {
        if (array == null || array.length == 0) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < array.length; i++) {
            if (i > 0) sb.append(delimiter);
            sb.append(array[i]);
        }
        return sb.toString();
    }
';

-- Simulate PostgreSQL % operator (similarity)
CREATE ALIAS IF NOT EXISTS "%" FOR "org.h2.util.StringUtils.contains";

-- Create the full_name trigger for client table
CREATE TRIGGER IF NOT EXISTS client_fullname_trigger
AFTER INSERT ON client
FOR EACH ROW
CALL "org.h2.api.Trigger.update"('UPDATE client SET full_name = CONCAT(first_name, '' '', last_name) WHERE id = STRINGTOUTF8(IDENTITY())');

-- Create function for client search
CREATE ALIAS IF NOT EXISTS client_search AS '
    String searchClients(String name) {
        return "SELECT * FROM client WHERE LOWER(full_name) LIKE ''%'' || LOWER('" + name + "') || ''%''";
    }
';