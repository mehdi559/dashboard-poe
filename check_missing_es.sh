#!/bin/bash

# Extraire toutes les clés utilisées dans CalendarScreenAI.js
USED_KEYS=$(grep -o "t('.*')" src/screens/CalendarScreenAI.js | sed "s/.*t('\\(.*\\)').*/\\1/" | sort | uniq)

# Extraire les clés existantes dans la section espagnole
EXISTING_KEYS=$(grep -A 1000 "es: {" src/i18n/translations.js | grep -B 1000 "}," | grep -o "^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*:" | sed 's/://' | sort | uniq)

echo "=== CLÉS MANQUANTES EN ESPAGNOL ==="
echo "Clés utilisées dans CalendarScreenAI.js:"
echo "$USED_KEYS"
echo ""
echo "Clés existantes en espagnol:"
echo "$EXISTING_KEYS"
echo ""
echo "=== COMPARAISON ==="

# Comparer et afficher les clés manquantes
for key in $USED_KEYS; do
    if ! echo "$EXISTING_KEYS" | grep -q "^$key$"; then
        echo "MANQUANTE: $key"
    fi
done 