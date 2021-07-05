#!/bin/bash

for item in ${!REACT_APP*}
do
  echo "$item=${!item}"
  find ./ -type f -exec sed -i -e "s/{"$item"_PLACEHOLDER}/${!item}/g" {} \;
done

nginx -g 'daemon off;'
