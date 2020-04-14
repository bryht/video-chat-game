#!/bin/sh
# if [ -z "$REACT_APP_APP_ID" ]
# then
#     echo "\$REACT_APP_APP_ID is empty"
# else
#     find ./ -type f -exec sed -i -e "s/{REACT_APP_APP_ID_PLACEHOLDER}/$REACT_APP_APP_ID/g" {} \;
# fi

# if [ -z "$REACT_APP_SECRET" ]
# then
#     echo "\$REACT_APP_SECRET is empty"
# else
#     find ./ -type f -exec sed -i -e "s/{REACT_APP_SECRET_PLACEHOLDER}/$REACT_APP_SECRET/g" {} \;
# fi

nginx -g 'daemon off;'