# Instructions du projet

## Design et CSS

- Toujours utiliser en priorité les variables fournies par Open Props avant d’introduire une valeur arbitraire.
- Cette règle s’applique notamment aux tailles de texte, espacements, dimensions, couleurs, bordures, ombres, rayons et animations.
- Une valeur arbitraire ne doit être ajoutée que si aucune variable Open Props ne répond au besoin de design.
- Lorsqu’une valeur arbitraire est nécessaire, conserver un choix cohérent avec l’échelle Open Props existante et documenter brièvement sa raison si elle n’est pas évidente.

## Git et branches

- Tous les messages de commit doivent respecter la convention [Conventional Commits](https://www.conventionalcommits.org/).
- Tout nouveau développement doit être réalisé sur une branche dédiée.
- Les branches de développement doivent être ouvertes vers `development`, qui sert de branche de staging.
- La mise en production se fait exclusivement en ouvrant `development` vers `main`.
- Ne jamais ouvrir `main` vers `development` ni vers une autre branche.
- Les hotfixes sont la seule exception autorisée au workflow normal de `main`.
- Tout hotfix appliqué à `main` doit également être ouvert vers `development` afin que le correctif soit conservé dans les développements suivants.
